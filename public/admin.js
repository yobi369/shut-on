(() => {
  const config = window.SHUTON_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const loginPanel = $('login-panel');
  const dashboard = $('dashboard');
  let client;
  let currentUser;

  function message(text, kind) {
    const box = $('status-message');
    box.textContent = text;
    box.className = 'notice' + (kind ? ' ' + kind : '');
    box.classList.remove('hidden');
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }
  function setBusy(button, busy, label) {
    button.disabled = busy;
    if (busy) {
      button.dataset.originalLabel = button.textContent;
      button.textContent = label || 'Please wait…';
    } else if (button.dataset.originalLabel) {
      button.textContent = button.dataset.originalLabel;
      delete button.dataset.originalLabel;
    }
  }
  function showSignedIn(user) {
    currentUser = user;
    loginPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
    $('login-error').textContent = '';
    loadPhotos();
  }
  async function loadPhotos() {
    const grid = $('photo-grid');
    grid.innerHTML = '';
    $('empty-state').classList.add('hidden');
    $('refresh-button').disabled = true;
    const { data, error } = await client.from('photos')
      .select('id,title,description,category,image_url,storage_path,alt_text,is_published,is_featured,created_at')
      .order('created_at', { ascending: false });
    $('refresh-button').disabled = false;
    if (error) {
      message('Could not load photos: ' + error.message + '. Check that the database setup SQL has been applied.', '');
      return;
    }
    const photos = data || [];
    $('total-count').textContent = photos.length;
    $('published-count').textContent = photos.filter((p) => p.is_published).length;
    $('draft-count').textContent = photos.filter((p) => !p.is_published).length;
    $('empty-state').classList.toggle('hidden', photos.length > 0);
    grid.innerHTML = photos.map((photo) => {
      const title = photo.title || 'Untitled photograph';
      return '<article class="photo-card">' +
        '<img loading="lazy" src="' + escapeHtml(photo.image_url) + '" alt="' + escapeHtml(photo.alt_text || title) + '">' +
        '<div class="photo-meta"><span class="status-pill ' + (photo.is_published ? 'live' : '') + '">' + (photo.is_published ? 'Published' : 'Draft') + '</span>' +
        '<p class="photo-title">' + escapeHtml(title) + '</p>' +
        '<p class="photo-sub">' + escapeHtml(photo.category || 'Other') + (photo.description ? ' · ' + escapeHtml(photo.description) : '') + '</p>' +
        '<div class="photo-actions"><button class="button button-light" data-action="toggle" data-id="' + escapeHtml(photo.id) + '">' + (photo.is_published ? 'Unpublish' : 'Publish') + '</button>' +
        '<button class="button button-light" data-action="delete" data-id="' + escapeHtml(photo.id) + '">Delete</button></div></div></article>';
    }).join('');
  }

  if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase) {
    $('setup-warning').classList.remove('hidden');
    $('login-form').querySelector('button').disabled = true;
    return;
  }
  client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  $('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter || $('login-form').querySelector('button');
    setBusy(button, true, 'Signing in…');
    $('login-error').textContent = '';
    const { data, error } = await client.auth.signInWithPassword({
      email: $('email').value.trim(),
      password: $('password').value
    });
    setBusy(button, false);
    if (error) {
      $('login-error').textContent = 'Sign-in failed. Check your details and try again.';
      return;
    }
    showSignedIn(data.user);
  });

  $('signout-button').addEventListener('click', async () => {
    await client.auth.signOut();
    currentUser = null;
    dashboard.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    $('password').value = '';
  });

  $('refresh-button').addEventListener('click', loadPhotos);

  $('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const files = Array.from($('photo-files').files || []);
    if (!files.length) return;
    if (files.length > 30) {
      message('Please upload no more than 30 images per batch.', '');
      return;
    }
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const invalid = files.find((file) => !allowed.has(file.type) || file.size > 12 * 1024 * 1024 || file.size === 0);
    if (invalid) {
      message('Each file must be a non-empty JPG, PNG or WebP image no larger than 12 MB. Problem file: ' + invalid.name, '');
      return;
    }
    const button = event.submitter || $('upload-form').querySelector('button[type="submit"]');
    setBusy(button, true, 'Uploading…');
    const progress = $('upload-progress');
    progress.classList.remove('hidden');
    const publish = $('publish-now').value === 'true';
    const category = $('photo-category').value;
    const description = $('photo-description').value.trim();
    let uploaded = 0;
    const failures = [];
    for (const file of files) {
      progress.textContent = 'Uploading ' + (uploaded + 1) + ' of ' + files.length + ': ' + file.name;
      const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-100) || 'photo';
      const objectPath = currentUser.id + '/' + Date.now() + '-' + crypto.randomUUID() + '-' + safeName;
      const { error: uploadError } = await client.storage.from('photography').upload(objectPath, file, {
        cacheControl: '31536000', upsert: false, contentType: file.type
      });
      if (uploadError) {
        failures.push(file.name + ': upload failed');
        continue;
      }
      const { data: publicData } = client.storage.from('photography').getPublicUrl(objectPath);
      const { error: insertError } = await client.from('photos').insert({
        title: file.name.replace(/\.[^.]+$/, '').slice(0, 180),
        description: description || null,
        category,
        storage_path: objectPath,
        image_url: publicData.publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, '').slice(0, 250),
        is_published: publish,
        is_featured: false
      });
      if (insertError) {
        await client.storage.from('photography').remove([objectPath]);
        failures.push(file.name + ': metadata save failed');
        continue;
      }
      uploaded += 1;
    }
    setBusy(button, false);
    progress.classList.add('hidden');
    $('photo-files').value = '';
    if (uploaded) {
      message(uploaded + ' photo(s) uploaded successfully.' + (failures.length ? ' ' + failures.length + ' failed; see details below.' : ''), failures.length ? '' : 'success');
    }
    if (failures.length) message('Some files could not be saved: ' + failures.join('; '), '');
    await loadPhotos();
  });

  $('photo-grid').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || !currentUser) return;
    const photo = button.dataset.id;
    const action = button.dataset.action;
    if (action === 'delete' && !window.confirm('Delete this photo from the portfolio? This cannot be undone.')) return;
    setBusy(button, true, action === 'delete' ? 'Deleting…' : 'Saving…');
    if (action === 'toggle') {
      const { data: row, error: readError } = await client.from('photos').select('is_published').eq('id', photo).single();
      if (!readError) {
        const { error } = await client.from('photos').update({ is_published: !row.is_published }).eq('id', photo);
        if (error) message('Could not update publication status: ' + error.message, '');
      } else message('Could not load the photo status.', '');
    } else if (action === 'delete') {
      const { data: row, error: readError } = await client.from('photos').select('storage_path').eq('id', photo).single();
      if (readError) {
        message('Could not find this photo.', '');
      } else {
        const { error: deleteRowError } = await client.from('photos').delete().eq('id', photo);
        if (deleteRowError) message('Could not delete the photo record: ' + deleteRowError.message, '');
        else {
          const { error: storageError } = await client.storage.from('photography').remove([row.storage_path]);
          if (storageError) message('Photo record deleted, but the stored file needs cleanup from storage.', '');
        }
      }
    }
    setBusy(button, false);
    await loadPhotos();
  });

  client.auth.getSession().then(({ data }) => {
    if (data.session) showSignedIn(data.session.user);
  });
})();

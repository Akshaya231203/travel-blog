(async function () {
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && !e.target.dataset.fallback) { e.target.dataset.fallback = 'true'; e.target.src = fallbackImage; } }, true);
  const header = document.querySelector('#site-header');
  if (header) {
    let user = null; try { user = (await api('/api/auth/me')).user; } catch {}
    const links = user ? '<a href="/">Home</a><a href="/pages/explore.html">Explore</a><a href="/pages/create-post.html">Write</a><a href="/pages/profile.html">My profile</a><a href="#" id="logout-link">Log out</a>' : '<a href="/">Home</a><a href="/pages/explore.html">Explore</a><a href="/pages/login.html">Log in</a><a class="nav-cta" href="/pages/signup.html">Join us ↗</a>';
    header.innerHTML = `<nav class="site-nav"><a class="brand" href="/">wander<span>ly.</span></a><button class="menu-toggle" aria-label="Toggle navigation">☰</button><div class="nav-links">${links}</div></nav>`;
    header.querySelector('.menu-toggle').addEventListener('click', () => header.querySelector('.nav-links').classList.toggle('open'));
    document.querySelector('#logout-link')?.addEventListener('click', async e => { e.preventDefault(); try { await api('/api/auth/logout', { method: 'POST' }); location.href = '/'; } catch (err) { alert(err.message); } });
  }
  const footer = document.querySelector('#site-footer'); if (footer) footer.innerHTML = '© ' + new Date().getFullYear() + ' Wanderly · Made for curious travelers.';
  if (document.body.dataset.page === 'home') { try { const { posts } = await api('/api/posts'); document.querySelector('#recent-posts').innerHTML = posts.length ? posts.slice(0,3).map(postCard).join('') : '<p class="empty-state">No travel posts available yet. Be the first to share your journey.</p>'; } catch { document.querySelector('#recent-posts').innerHTML = '<p class="empty-state">Stories could not load. Please try again soon.</p>'; } }
})();
function postCard(p, owner = false) { return `<article class="post-card"><a href="/pages/post-details.html?id=${encodeURIComponent(p.id)}"><img src="${escapeHTML(p.image || fallbackImage)}" alt="Travel in ${escapeHTML(p.location)}"><div class="post-card-body"><p class="location">↗ ${escapeHTML(p.location)}</p><h3>${escapeHTML(p.title)}</h3><p class="excerpt">${escapeHTML(p.description.slice(0,125))}${p.description.length>125?'…':''}</p><div class="post-meta"><span>By ${escapeHTML(p.author || 'Traveler')}</span><span>${formatDate(p.created_at)}</span></div></div></a><div class="post-actions"><span>♡ ${p.like_count || 0} &nbsp; · &nbsp; ◌ ${p.comment_count || 0}</span><a href="/pages/post-details.html?id=${encodeURIComponent(p.id)}">Read story ↗</a></div>${owner?`<div class="owner-actions"><a class="small-button" href="/pages/edit-post.html?id=${p.id}">Edit</a><button class="small-button danger delete-post" data-id="${p.id}">Delete</button></div>`:''}</article>`; }
window.postCard = postCard;

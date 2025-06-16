(function () {
  const allow = sessionStorage.getItem('allowcomingsoon');

  if (allow === 'true') {
    // Access granted, now invalidate so it can’t be reused
    sessionStorage.removeItem('allowcomingsoon');
  } else {
    // No valid access token, block access
    alert("You dont have direct access to this page!");
    window.location.href = '/';
  }
})();



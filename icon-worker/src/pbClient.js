export async function pbAdminLogin({ baseUrl, email, password }) {
  const url = `${baseUrl}/api/admins/auth-with-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PocketBase login failed: ${res.status} ${res.statusText} :: ${t}`);
  }

  const json = await res.json();
  return { token: json?.token };
}

export async function pbListTopicIconsNeedingIcons({ baseUrl, token, maxItems }) {
  const filter = encodeURIComponent(`icon_file = "" || icon_file = null`);
  const url = `${baseUrl}/api/collections/topic_icons/records?perPage=${maxItems}&filter=${filter}`;

  const res = await fetch(url, { headers: { Authorization: token } });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PocketBase list failed: ${res.status} ${res.statusText} :: ${t}`);
  }

  const json = await res.json();
  return json?.items || [];
}

export async function pbUpdateTopicIconRecord({ baseUrl, token, recordId, data }) {
  const url = `${baseUrl}/api/collections/topic_icons/records/${recordId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PocketBase update failed: ${res.status} ${res.statusText} :: ${t}`);
  }

  return await res.json();
}

export async function pbUploadTopicIconFile({ baseUrl, token, recordId, filename, pngBuffer }) {
  const url = `${baseUrl}/api/collections/topic_icons/records/${recordId}`;

  const form = new FormData();
  form.append("icon_file", new Blob([pngBuffer], { type: "image/png" }), filename);

  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: token },
    body: form
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PocketBase file upload failed: ${res.status} ${res.statusText} :: ${t}`);
  }

  return await res.json();
}

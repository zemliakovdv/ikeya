// Ссылки каталога с trailingSlash: слеш стоит до query, /catalog/razdel/?page=2.
export function withTrailingSlash(path) {
  const value = String(path ?? '');
  if (!value) return '';

  const hashIndex = value.indexOf('#');
  const hash = hashIndex === -1 ? '' : value.slice(hashIndex);
  const beforeHash = hashIndex === -1 ? value : value.slice(0, hashIndex);
  const queryIndex = beforeHash.indexOf('?');
  const pathname = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const search = queryIndex === -1 ? '' : beforeHash.slice(queryIndex);

  if (!pathname || pathname === '/') return `${pathname || '/'}${search}${hash}`;

  const slashed = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${slashed}${search}${hash}`;
}

export function buildPaginationUrl(basePath, queryParams, page) {
  const params = new URLSearchParams(queryParams);
  const pageNumber = Number(page);

  if (Number.isFinite(pageNumber) && pageNumber > 1) {
    params.set('page', String(Math.floor(pageNumber)));
  } else {
    params.delete('page');
  }

  const path = withTrailingSlash(basePath);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

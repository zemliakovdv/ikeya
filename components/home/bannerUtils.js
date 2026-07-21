import { resolveImageUrl } from '@/lib/api/ikea';

export function resolveBannerImageUrl(imageUrl) {
  return resolveImageUrl(imageUrl);
}

function getAttributes(record) {
  return record?.attributes && typeof record.attributes === 'object'
    ? record.attributes
    : record || {};
}

export function normalizeBannerRecord(record) {
  const attr = getAttributes(record);
  const link = attr.link_url || '/catalog';
  const position = Number(attr.position) || 0;

  return {
    id: record?.id ?? attr.id ?? null,
    section: attr.section || null,
    slotKey: attr.slot_key || null,
    breakpoint: attr.breakpoint ? String(attr.breakpoint).trim().toLowerCase() : null,
    variant: attr.variant || null,
    width: Number(attr.width) || 0,
    height: Number(attr.height) || 0,
    position,
    image: resolveBannerImageUrl(attr.image_url),
    linkUrl: attr.link_url || null,
    link,
    updatedAt: attr.updated_at || null,
  };
}

export function groupResponsiveBanners(records) {
  const groups = new Map();

  records.forEach((record) => {
    if (!record?.slotKey) return;

    const group = groups.get(record.slotKey) || [];
    group.push(record);
    groups.set(record.slotKey, group);
  });

  return Array.from(groups.values()).sort((a, b) => {
    const aPosition = Math.min(...a.map((record) => record.position || 0));
    const bPosition = Math.min(...b.map((record) => record.position || 0));
    return aPosition - bPosition;
  });
}

function pickByBreakpoint(group, breakpoint) {
  const seen = new Set();
  const priorities = [breakpoint, 'all', 'tablet', 'desktop', 'mobile'];

  for (const currentBreakpoint of priorities) {
    if (seen.has(currentBreakpoint)) continue;
    seen.add(currentBreakpoint);

    const match = group.find(
      (record) => record?.image && record.breakpoint === currentBreakpoint,
    );
    if (match) return match;
  }

  return null;
}

export function pickResponsiveImages(group) {
  const desktop = pickByBreakpoint(group, 'desktop');
  const tablet = pickByBreakpoint(group, 'tablet');
  const mobile = pickByBreakpoint(group, 'mobile');

  if (!desktop?.image || !tablet?.image || !mobile?.image) return null;

  return {
    desktop,
    tablet,
    mobile,
    desktopImage: desktop.image,
    tabletImage: tablet.image,
    mobileImage: mobile.image,
  };
}

export function mapResponsiveBannerGroup(group) {
  const images = pickResponsiveImages(group);

  if (!group?.length || !images) return null;

  const sortedGroup = [...group].sort((a, b) => (a.position || 0) - (b.position || 0));
  const first = sortedGroup[0];
  const linkRecord = sortedGroup.find((record) => record.linkUrl);
  const linkUrl = linkRecord?.linkUrl || '/catalog';

  return {
    id: first.id || first.slotKey,
    slotKey: first.slotKey,
    position: first.position,
    link: linkUrl,
    linkUrl,
    desktopImage: images.desktopImage,
    tabletImage: images.tabletImage,
    mobileImage: images.mobileImage,
  };
}

function hasSize(record, width, height) {
  return record?.width === width && record?.height === height;
}

function pickAdvertisingImage(group, candidates) {
  for (const candidate of candidates) {
    const match = group.find((record) => {
      if (!record?.image) return false;
      if (candidate.breakpoint && record.breakpoint !== candidate.breakpoint) return false;
      if (!candidate.size) return true;

      return hasSize(record, candidate.size.width, candidate.size.height);
    });

    if (match) return match;
  }

  return null;
}

export function mapAdvertisingBannerGroup(group) {
  if (!group?.length) return null;

  const desktop = pickAdvertisingImage(group, [
    { breakpoint: 'desktop', size: { width: 742, height: 256 } },
    { breakpoint: 'all' },
    { breakpoint: 'tablet', size: { width: 960, height: 256 } },
    { breakpoint: 'mobile', size: { width: 960, height: 256 } },
    { breakpoint: 'desktop' },
    {},
  ]);
  const tablet = pickAdvertisingImage(group, [
    { breakpoint: 'tablet', size: { width: 960, height: 256 } },
    { breakpoint: 'mobile', size: { width: 960, height: 256 } },
    { breakpoint: 'all' },
    { breakpoint: 'desktop' },
  ]);
  const mobile = pickAdvertisingImage(group, [
    { breakpoint: 'mobile', size: { width: 960, height: 256 } },
    { breakpoint: 'tablet', size: { width: 960, height: 256 } },
    { breakpoint: 'all' },
    { breakpoint: 'desktop' },
  ]);

  if (!desktop?.image || !tablet?.image || !mobile?.image) return null;

  const sortedGroup = [...group].sort((a, b) => (a.position || 0) - (b.position || 0));
  const first = sortedGroup[0];
  const linkRecord = sortedGroup.find((record) => record.linkUrl);
  const linkUrl = linkRecord?.linkUrl || '/catalog';

  return {
    id: first.id || first.slotKey,
    slotKey: first.slotKey,
    position: first.position,
    link: linkUrl,
    linkUrl,
    desktopImage: desktop.image,
    tabletImage: tablet.image,
    mobileImage: mobile.image,
  };
}

export function isExternalLink(url) {
  return /^https:\/\//i.test(String(url || ''));
}

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
    id: record?.id ?? attr.id ?? `${position}::${link}`,
    section: attr.section || null,
    slotKey: attr.slot_key || attr.banner_group_id || `${position}::${link}`,
    breakpoint: attr.breakpoint || null,
    variant: attr.variant || null,
    width: Number(attr.width) || 0,
    height: Number(attr.height) || 0,
    position,
    image: resolveBannerImageUrl(attr.image_url),
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

function matchesSize(record, size) {
  return record?.width === size.width && record?.height === size.height;
}

function pickBySizes(group, sizes) {
  for (const size of sizes) {
    const match = group.find((record) => matchesSize(record, size));
    if (match) return match;
  }

  return group.find((record) => record?.image) || null;
}

export function pickResponsiveImages(group, expectedSizes) {
  const desktop = pickBySizes(group, [
    expectedSizes.desktop,
    expectedSizes.tablet,
    expectedSizes.mobile,
  ]);
  const tablet = pickBySizes(group, [
    expectedSizes.tablet,
    expectedSizes.desktop,
    expectedSizes.mobile,
  ]);
  const mobile = pickBySizes(group, [
    expectedSizes.mobile,
    expectedSizes.tablet,
    expectedSizes.desktop,
  ]);

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

export function isExternalLink(url) {
  return /^https:\/\//i.test(String(url || ''));
}

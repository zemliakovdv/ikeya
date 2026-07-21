import AdvertisingBannerSlider from '@/components/home/AdvertisingBannerSlider';
import { getAdvertisingBanners } from '@/lib/api/ikea';
import {
  groupResponsiveBanners,
  mapAdvertisingBannerGroup,
  normalizeBannerRecord,
} from '@/components/home/bannerUtils';

export default async function AdvertisingBannersServer() {
  try {
    const { data } = await getAdvertisingBanners();

    if (!data?.length) return null;

    const banners = data
      .map(normalizeBannerRecord)
      .filter((banner) => banner.image)
      .filter((banner) => !banner.section || banner.section === 'advertising');

    const slides = groupResponsiveBanners(banners)
      .map(mapAdvertisingBannerGroup)
      .filter(Boolean);

    if (!slides.length) return null;

    return <AdvertisingBannerSlider slides={slides} />;
  } catch (e) {
    console.error('Error loading advertising banners:', e);
    return null;
  }
}

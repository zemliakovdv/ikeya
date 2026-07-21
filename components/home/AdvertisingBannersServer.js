import AdvertisingBannerSlider from '@/components/home/AdvertisingBannerSlider';
import { getAdvertisingBanners } from '@/lib/api/ikea';
import { normalizeBannerRecord } from '@/components/home/bannerUtils';

export default async function AdvertisingBannersServer() {
  try {
    const { data } = await getAdvertisingBanners();

    if (!data?.length) return null;

    const slides = data
      .map(normalizeBannerRecord)
      .filter((banner) => banner.image)
      .filter((banner) => !banner.section || banner.section === 'advertising')
      .sort((a, b) => a.position - b.position)
      .map((banner) => ({
        id: banner.id,
        position: banner.position,
        link: banner.link || '/catalog',
        image: banner.image,
      }));

    if (!slides.length) return null;

    return <AdvertisingBannerSlider slides={slides} />;
  } catch (e) {
    console.error('Error loading advertising banners:', e);
    return null;
  }
}

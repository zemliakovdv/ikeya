import StartSlider from '@/components/home/StartSlider';
import {
  groupResponsiveBanners,
  mapResponsiveBannerGroup,
  normalizeBannerRecord,
} from '@/components/home/bannerUtils';
import { getMainSliderBanners } from '@/lib/api/ikea';

export default async function StartSliderServer() {
  try {
    const { data } = await getMainSliderBanners();

    if (!data?.length) return null;

    const banners = data
      .map(normalizeBannerRecord)
      .filter((banner) => banner.image)
      .filter((banner) => !banner.section || banner.section === 'main');

    const slides = groupResponsiveBanners(banners)
      .map(mapResponsiveBannerGroup)
      .filter(Boolean);

    if (!slides.length) return null;

    return <StartSlider slides={slides} />;
  } catch (e) {
    console.error('Error loading main slider:', e);
    return null;
  }
}

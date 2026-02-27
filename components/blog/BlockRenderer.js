import TextWithImageBlock from './blocks/TextWithImageBlock';
import ImageLeftTextRightBlock from './blocks/ImageLeftTextRightBlock';
import ImageRightTextLeftBlock from './blocks/ImageRightTextLeftBlock';
import TextImagesRowBlock from './blocks/TextImagesRowBlock';
import ProductsGridBlock from './blocks/ProductsGridBlock';
import CategoriesGridBlock from './blocks/CategoriesGridBlock';

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case 'text_with_image':       return <TextWithImageBlock block={block} />;
    case 'image_left_text_right': return <ImageLeftTextRightBlock block={block} />;
    case 'image_right_text_left': return <ImageRightTextLeftBlock block={block} />;
    case 'text_images_row':       return <TextImagesRowBlock block={block} />;
    case 'products_grid':         return <ProductsGridBlock block={block} />;
    case 'categories_grid':       return <CategoriesGridBlock block={block} />;
    default: return null;
  }
}

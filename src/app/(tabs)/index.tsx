import { View } from 'react-native';
import { ProductListItem } from '@/components/ProductListItem';
import products from '../../../assets/data/products';

export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[0]} />
      <ProductListItem product={products[1]} />
    </View>
  );
}
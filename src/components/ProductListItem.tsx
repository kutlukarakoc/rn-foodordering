import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Colors from '@/constants/Colors';

import { Product } from '@/types';
import { Link } from 'expo-router';

type ProductListItemProps = {
  product: Product;
};

export const defaultPizzaOmage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link
      href={`/${product.id}`}
      asChild
    >
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaOmage }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
  },
});

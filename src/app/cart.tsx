import { View, Text, Platform, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';
import Button from '@/components/Button';

export default function Cart() {
  const { items, total } = useCart();

  return (
    <View style={styles.container}>
      {items.length ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            contentContainerStyle={styles.productList}
          />
          <Text style={styles.total}>${total}</Text>
          <Button text="Checkout" />
        </>
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={styles.noProducts}>There is no pizza in your cart</Text>
          <Text style={[styles.noProducts, { fontSize: 17 }]}>
            Check out our delicious pizzas
          </Text>
          <Link
            href="/menu/"
            style={styles.link}
          >
            <Text>Menu</Text>
          </Link>
        </View>
      )}

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  productList: {
    padding: 10,
    gap: 10,
  },
  total: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '500',
  },
  noProducts: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    marginTop: 30,
    textDecorationLine: 'underline',
    fontSize: 17,
  },
});

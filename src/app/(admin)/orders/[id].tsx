import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import orders from 'assets/data/orders';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { OrderStatusList, OrderStatus } from '@/types';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const order = orders.find((order) => order.id === +id);

  if (!order) return <Text>Not found</Text>;

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);

  return (
    <View style={{ padding: 10, gap: 20, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        ListFooterComponent={() => (
          <>
            <Text style={styles.statusTitle}>Status</Text>
            <View style={styles.statusOptions}>
              {OrderStatusList.map((status: OrderStatus) => (
                <Pressable
                  key={status}
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        orderStatus === status ? Colors.light.tint : 'white',
                    },
                  ]}
                  onPress={() => setOrderStatus(status)}
                >
                  <Text
                    style={{
                      color:
                        orderStatus === status ? 'white' : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    gap: 10,
  },
  statusTitle: {
    fontWeight: '500',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 5,
  },
  status: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});

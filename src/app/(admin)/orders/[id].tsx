import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/Colors';
import { OrderStatusList, OrderStatus } from '@/types';
import { useOrderDetails } from '@/api/orders';
import { useUpdateOrder } from '@/api/order-items';
import { notifyUserAboutOrderUpdate } from '@/lib/notifications';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const { data: order, isLoading, error } = useOrderDetails(+id);
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  const updateStatus = async (status: OrderStatus) => {
    updateOrder({ id: +id, updatedFields: { status } });

    if (order) {
      await notifyUserAboutOrderUpdate({ ...order, status });
    }
  };

  if (isLoading) return <ActivityIndicator />;

  if (error) return <Text>Failed to fetch order</Text>;

  if (!order) return <Text>Order not found</Text>;

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
                  disabled={isPending}
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        order.status === status ? Colors.light.tint : 'white',
                      opacity: isPending ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => updateStatus(status)}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? 'white' : Colors.light.tint,
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

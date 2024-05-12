import { ActivityIndicator, FlatList, Text } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { useUserOrdersList } from '@/api/orders';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useUserOrdersList();

  if (isLoading) return <ActivityIndicator />;

  if (error) return <Text>Failed to fetch orders</Text>;

  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  );
}

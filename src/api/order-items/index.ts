import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InsertTables, UpdateTables } from '@/types';

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(items: InsertTables<'order_items'>[]) {
      const { error, data: newOrder } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<'orders'>;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },

    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};

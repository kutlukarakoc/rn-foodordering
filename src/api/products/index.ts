import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/database.types';
import { InsertTables } from '@/types';

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(product: InsertTables<'products'>) {
      const { error, data: newProduct } = await supabase
        .from('products')
        .insert({
          name: product.name,
          image: product.image,
          price: product.price,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(product: Omit<Tables<'products'>, 'created_at'>) {
      const { error, data: updatedProduct } = await supabase
        .from('products')
        .update({
          name: product.name,
          image: product.image,
          price: product.price,
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },

    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error, data: deletedProduct } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
      return deletedProduct;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

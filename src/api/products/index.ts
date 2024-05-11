import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    async mutationFn(product: any) {
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

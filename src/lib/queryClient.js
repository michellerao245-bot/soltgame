import { QueryClient } from '@tanstack/react-query';

// Ye 'queryClient' tumhare poore application mein data fetching ko manage karega
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data kitni der tak fresh rahega (default 5 minutes)
      staleTime: 1000 * 60 * 5, 
      // Agar error aaye, toh kitni baar retry kare
      retry: 2, 
      // Tab switch karne par refetch na ho (performance ke liye)
      refetchOnWindowFocus: false,
    },
  },
});
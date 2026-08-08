import { useApp } from './useApp';

export const useTickets = () => {
  const { tickets, buyTicket } = useApp();

  return {
    tickets,
    buyTicket,
    activeTickets: tickets.filter((t) => t.status === 'active'),
  };
};

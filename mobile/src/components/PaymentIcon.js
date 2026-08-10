import { Banknote, CreditCard, Smartphone } from 'lucide-react-native';

export function PaymentIcon({ icon, size, color }) {
  if (icon === 'card') return <CreditCard size={size} color={color} />;
  if (icon === 'phone') return <Smartphone size={size} color={color} />;
  return <Banknote size={size} color={color} />;
}

import { useAppKit } from "@reown/appkit-wagmi-react-native";
import { Pressable, Text } from "react-native";

const WalletOptions = () => {
  const { open } = useAppKit();

  return (
    <>
      <Pressable onPress={() => open()}>
        <Text>Open Connect Modal</Text>
      </Pressable>
    </>
  );
};
export default WalletOptions;

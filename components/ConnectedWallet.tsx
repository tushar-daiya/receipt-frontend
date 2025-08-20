import { useGetTransaction } from "@/lib/api/transaction";
import { authStore } from "@/lib/auth-store";
import { Feather } from "@expo/vector-icons";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { taraxaTestnet } from "viem/chains";
import { useAccount, useBalance, useDisconnect } from "wagmi";

const ConnectedWalletScreen = () => {
  const { address, isConnected } = useAccount();
  const { user } = authStore();
  const { disconnect } = useDisconnect();
  const result = useBalance({ address, chainId: taraxaTestnet.id });

  // Fetch transactions for the connected wallet
  const {
    data: transactionData,
    isPending: isLoading,
    isError,
  } = useGetTransaction({
    params: { wallet_address: address || "" },
  });

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between py-4">
          <View className="w-8" />
          <Text className="text-xl font-semibold text-white">Wallet</Text>
          <View className="w-8" />
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="user" size={20} color={"white"} />
          </View>
          <View>
            <Text className="text-white font-medium">Username</Text>
            <Text className="text-slate-400 text-sm">{user?.username}</Text>
          </View>
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="mail" size={20} color={"white"} />
          </View>
          <View>
            <Text className="text-white font-medium">Email</Text>
            <Text className="text-slate-400 text-sm">{user?.email}</Text>
          </View>
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="user" size={20} color={"white"} />
          </View>
          <View>
            <Text className="text-white font-medium">Full Name</Text>
            <Text className="text-slate-400 text-sm">{user?.name}</Text>
          </View>
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="copy" size={20} color={"white"} />
          </View>
          <View>
            <Text className="text-white font-medium">Wallet Address</Text>
            <Text className="text-slate-400 text-sm">{address}</Text>
          </View>
        </View>
      </ScrollView>
      <View className="bg-primaryMuted rounded-2xl p-6 mb-6 relative overflow-hidden">
        {/* Decorative shapes */}
        <View className="absolute top-4 right-4">
          <View className="w-32 h-32 bg-primary2 rounded-full opacity-60" />
        </View>
        <View className="absolute -top-4 right-8">
          <View className="w-24 h-24 bg-white rounded-full opacity-40" />
        </View>

        <View className="mt-8">
          <Text className="text-slate-800 text-lg font-medium mb-2">
            Your Current Balance
          </Text>
          <Text className="text-slate-900 text-3xl font-bold">
            {result.data?.formatted} {result.data?.symbol.toLowerCase()}
          </Text>
        </View>
      </View>

      {/* Transactions Section */}
      <View className="bg-primaryMuted rounded-2xl p-6 mb-6">
        <Text className="text-slate-800 text-lg font-medium mb-4">
          Recent Transactions
        </Text>
        {isLoading && <Text className="text-slate-400">Loading...</Text>}
        {isError && (
          <Text className="text-red-500">Failed to load transactions.</Text>
        )}
        {transactionData?.transactions?.length ? (
          transactionData.transactions.map((txn: any, index: any) => (
            <View
              key={index}
              className="flex-row justify-between items-center mb-4"
            >
              <View>
                <Text className="text-slate-900 font-medium">
                  {txn.hash.slice(0, 6)}...{txn.hash.slice(-4)}
                </Text>
                <Text className="text-slate-400 text-sm">
                  Block: {txn.blockNumber}
                </Text>
              </View>
              <Text className="text-slate-800 font-medium">
                {txn.value} TARA
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-slate-400">No transactions found.</Text>
        )}
      </View>

      <View className="py-4">
        <Pressable
          className="bg-red-500 rounded-full py-3 flex-row justify-center items-center"
          onPress={() => disconnect()}
        >
          <Feather
            name="log-out"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-lg">Disconnect</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ConnectedWalletScreen;

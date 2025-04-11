import Toast from "react-native-toast-message";
import { useNetInfo } from "@react-native-community/netinfo";
import { TRPCClientErrorLike } from "@trpc/client";

export const useMutationManager = () => {
  const netInfo = useNetInfo();

  const displayError = (error: TRPCClientErrorLike<any>) => {
    if (!netInfo.isInternetReachable) {
      Toast.show({
        type: "warning",
        text1: "No internet connection",
        text2: "Please try again later",
      });
    } else {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message ?? "Please try again later",
      });
    }
  };

  return { displayError };
};

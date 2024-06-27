import { useFields } from "@/services/fieldService";
import { useCreateScore } from "@/services/scoreService";
import { useCallback, useEffect } from "react";
import { NativeModules, NativeEventEmitter, NativeModule } from "react-native";

const { XplaneWidgetModule } = NativeModules;
const XplaneEventEmitter = new NativeEventEmitter(
  NativeModules.XplaneEventEmitter as NativeModule
);

const LiveActivity = () => {
  const { data: fields } = useFields(true);
  const { mutateAsync: createScore } = useCreateScore();

  const handleScore = useCallback(
    async ({ field }: any) => {
      if (!fields) return;
      const id = fields.find(({ icon }) => icon === field)?.$id || "";

      await createScore({
        success: true,
        fields: id,
        comment: "",
      });
    },
    [fields]
  );

  useEffect(() => {
    if (fields) {
      XplaneWidgetModule.setLiveActivity(fields.map(({ icon }) => icon));
    }
  }, [fields]);

  useEffect(() => {
    const scoreSubscription = XplaneEventEmitter.addListener(
      "onScore",
      handleScore
    );
    return () => {
      scoreSubscription.remove();
    };
  }, [fields]);

  return null;
};

export default LiveActivity;

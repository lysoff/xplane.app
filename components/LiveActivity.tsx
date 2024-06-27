import { useFields } from "@/services/fieldService";
import { useCreateScore } from "@/services/scoreService";
import { useEffect } from "react";
import { NativeModules, NativeEventEmitter, NativeModule } from "react-native";

const { XplaneWidgetModule } = NativeModules;
const XplaneEventEmitter = new NativeEventEmitter(
  NativeModules.XplaneEventEmitter as NativeModule
);

const LiveActivity = () => {
  const { data: fields } = useFields(true);
  const { mutateAsync: createScore } = useCreateScore();

  const handleScore = async ({ field }: any) => {
    if (!fields) return;

    const id = fields.find(({ icon }) => icon === field)?.$id || "";

    await createScore({ success: true, fields: id, comment: "" });
  };

  useEffect(() => {
    if (fields) {
      XplaneWidgetModule.updateLiveActivity(fields.map(({ icon }) => icon));
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
  }, []);

  return null;
};

export default LiveActivity;

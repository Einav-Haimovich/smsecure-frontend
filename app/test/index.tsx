import {Button, View, Text} from "react-native";
import {requestCameraPermission, requestSmsPermissions} from "@/utils/permissions";
import SmsApp from "@/features/test/SmsApp";


const handleSmsRequest = async () => {
    console.log('button pressed!');
    await requestSmsPermissions();
}

export default function TestPage() {
    return (
        // <View>
        //     <Text>Hello world!!!</Text>
        //     {/*<Button title={"Press here!"} onPress={async () => await requestSmsPermissions()}></Button>*/}
        //     <Button title={"Press here!"} onPress={handleSmsRequest}></Button>
        // </View>
        <SmsApp/>
    )
}
import Category from "./Category";
import {updateVehicle} from "../../slices/appInformation"

export default function Vehicle()
{
    return <Category category="Vehicle" action={updateVehicle} />
}
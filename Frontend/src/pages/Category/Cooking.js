import Category from "./Category";
import {updateCooking} from "../../slices/appInformation"

export default function Cooking()
{
    return <Category category="Cooking" action={updateCooking} />
}
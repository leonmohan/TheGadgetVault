import Category from "./Category";
import {updateComputer} from "../../slices/appInformation"


export default function Computer()
{
    return <Category category="Computer" action={updateComputer} />
}
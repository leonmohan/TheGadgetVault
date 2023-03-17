import Category from "./Category";
import {updateOutdoor} from "../../slices/appInformation"

export default function Outdoor()
{
    return <Category category="Outdoor" action={updateOutdoor} />
}
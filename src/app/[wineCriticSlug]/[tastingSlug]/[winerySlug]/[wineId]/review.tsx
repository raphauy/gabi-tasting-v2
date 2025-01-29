import { ReviewDAO } from "@/services/review-services"
import { setFieldAction } from "../reviews/review-actions"
import CategoryBox, { DataField } from "./category-box"

type Props = {
    review: ReviewDAO
}

export function Review({ review }: Props) {

    const intensity: DataField = {
        id: review.id,
        name: "intensity",
        initialValue: review.intensity || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Pale", "Medium", "Deep"]
    }
    const colour: DataField = {
        id: review.id,
        name: "colour",
        initialValue: review.colour || "",
        update: setFieldAction,
        type: "input"
    }
    const appearanceFields: DataField[] = [colour, intensity]

    const aromaIntensity: DataField = {
        id: review.id,
        name: "aromaIntensity",
        initialValue: review.aromaIntensity || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Light", "Medium", "Pronounced"]
    }
    const aromaPrimary: DataField = {
        id: review.id,
        name: "aromaPrimary",
        initialValue: review.aromaPrimary || "",
        update: setFieldAction,
        type: "textarea"
    }
    const aromaSecondary: DataField = {
        id: review.id,
        name: "aromaSecondary",
        initialValue: review.aromaSecondary || "",
        update: setFieldAction,
        type: "textarea"
    }
    const aromaTertiary: DataField = {
        id: review.id,
        name: "aromaTertiary",
        initialValue: review.aromaTertiary || "",
        update: setFieldAction,
        type: "textarea"
    }
    const noseFields: DataField[] = [aromaIntensity, aromaPrimary, aromaSecondary, aromaTertiary]

    const sweetness: DataField = {
        id: review.id,
        name: "sweetness",
        initialValue: review.sweetness || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Dry", "Off-dry", "Medium", "Sweet"]
    }
    const acidity: DataField = {
        id: review.id,
        name: "acidity",
        initialValue: review.acidity || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Low", "Medium", "High"]
    }
    const alcohol: DataField = {
        id: review.id,
        name: "alcohol",
        initialValue: review.alcohol || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Low", "Medium", "High"]
    }
    const tannins: DataField = {
        id: review.id,
        name: "tannins",
        initialValue: review.tannins || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Low", "Medium", "High"]
    }
    const tanninsNature: DataField = {
        id: review.id,
        name: "tanninsNature",
        initialValue: review.tanninsNature || "",
        update: setFieldAction,
        type: "input",
        selectOptions: ["Low", "Medium", "High"]
    }
    const body: DataField = {
        id: review.id,
        name: "body",
        initialValue: review.body || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Light", "Medium", "Full"]
    }
    const flavourIntensity: DataField = {
        id: review.id,
        name: "flavourIntensity",
        initialValue: review.flavourIntensity || "",
        update: setFieldAction,
        type: "select",
        selectOptions: ["Light", "Medium", "Pronounced"]
    }
    const flavourCharacteristics: DataField = {
        id: review.id,
        name: "flavourCharacteristics",
        initialValue: review.flavourCharacteristics || "",
        update: setFieldAction,
        type: "textarea"
    }
    const palateFields: DataField[] = [sweetness, acidity, alcohol, tannins, tanninsNature, body, flavourIntensity, flavourCharacteristics]

    const comments: DataField = {
        id: review.id,
        name: "comments",
        initialValue: review.comments || "",
        update: setFieldAction,
        type: "textarea"
    }
    const score: DataField = {
        id: review.id,
        name: "score",
        initialValue: review.score || "",
        update: setFieldAction,
        type: "number",
        min: 0,
        max: 100,
        step: 1
    }
    const finished: DataField = {
        id: review.id,
        name: "finished",
        initialValue: review.finished,
        update: setFieldAction,
        type: "boolean"
    }
    const conclusionFields: DataField[] = [comments, score, finished]

    return (
        <div className="grid lg:grid-cols-2 gap-4">
            <CategoryBox title="Appearance" iconName="Eye" dataFields={appearanceFields} />
            <CategoryBox title="Nose" iconName="Wind" dataFields={noseFields} />
            <CategoryBox title="Palate" iconName="Utensils" dataFields={palateFields} />
            <CategoryBox title="Conclusion" iconName="ClipboardCheck" dataFields={conclusionFields} />
        </div>
    )
}

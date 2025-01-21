"use client"

import { IconBadge } from "@/components/icon-badge"
import { TextForm } from "@/components/text-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

export type DataField = {
  id: string
  name: string
  initialValue: string
  update: (id: string, name: string, value: string | number | boolean | undefined) => Promise<boolean>
  type: "input" | "textarea" | "select"
  selectOptions?: string[]
}

type Props = {
  title: string
  iconName: keyof typeof Icons
  dataFields: DataField[]
}

export default function CategoryBox({ title, iconName, dataFields }: Props) {
  const Icon = Icons[iconName] as LucideIcon

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            <div className="flex items-center gap-x-2">
                <IconBadge icon={Icon} variant="orange"/>
                <p className="text-xl">{title}</p>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dataFields.map((dataField) => (
          <TextForm key={dataField.name} id={dataField.id} label={getLabel(dataField.name)} fieldName={dataField.name} initialValue={dataField.initialValue} update={dataField.update} type={dataField.type} selectOptions={dataField.selectOptions}/>
        ))}
      </CardContent>
    </Card>
  )
}

function getLabel(fieldName: string) {
  switch (fieldName) {
    case "intensity":
      return "Intensity"
    case "colour":
      return "Colour"
    case "aromaIntensity":
      return "Aroma Intensity"
    case "aromaPrimary":
      return "Aroma Primary"
    case "aromaSecondary":
      return "Aroma Secondary"
    case "aromaTertiary":
      return "Aroma Tertiary"
    case "sweetness":
      return "Sweetness"
    case "acidity":
      return "Acidity"
    case "alcohol":
      return "Alcohol"
    case "body":
      return "Body"
    case "flavourIntensity":
      return "Flavour Intensity"
    case "flavourCharacteristics":
      return "Flavour Characteristics"
    case "score":
      return "Score"
    case "comments":
      return "Comments"
    default:
      return fieldName
  }
}

// intensity               String?                              // gennext: show.column
// colour                  String?                              // gennext: show.column
// aromaIntensity          String?                              // gennext: show.column

// aromaPrimary            String?                              // gennext: show.column
// aromaSecondary          String?                              // gennext: show.column
// aromaTertiary           String?                              // gennext: show.column

// sweetness               String?                              // gennext: show.column
// acidity                 String?                              // gennext: show.column
// alcohol                 String?                              // gennext: show.column
// body                    String?                              // gennext: show.column

// flavourIntensity        String?                              // gennext: show.column
// flavourCharacteristics  String?                              // gennext: show.column

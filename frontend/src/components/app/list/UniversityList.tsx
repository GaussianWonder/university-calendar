import Quill from "quill";
import { Link } from "solid-app-router";
import { universityListFetcher } from "../../../logic/fetchers";
import { University } from "../../../types/models/university";
import Button from "../../button/Button";
import { SolidQuill } from "../../quill/SolidQuill";
import ListComponent from "./List";

const UniversityList = ListComponent<University>({
  fetcher: universityListFetcher,
  ItemRenderer: (props) => {
    let quill: Quill;
 
    const item = () => props.item;
    const description = () => item().description;

    return (
      <div class="flex flex-col gap-1 px-2 py-1 rounded-lg hover:bg-gray-200">
        <Link href={`/university/${item().id}`}>
          <Button style="secondary">
            <h3 class="text-lg font-medium text-gray-900">{ item().name }</h3>
          </Button>
        </Link>
        <div>
          <SolidQuill
            class="bg-gray-100 min-h-[200px] max-h-sm overflow-auto rounded-lg"
            placeholder="No description"
            ref={quill}
            as="div"
            contentEditable={false}
            readOnly={true}
            modules={{
              toolbar: false,
              clipboard: { matchVisual: false },
            }}
            onReady={(q) => {
              q.setContents(description());
            }}
          />
        </div>
      </div>
    );
  },
});

export default UniversityList;

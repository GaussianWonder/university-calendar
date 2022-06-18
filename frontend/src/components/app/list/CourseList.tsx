import Quill from "quill";
import { Link } from "solid-app-router";
import { courseListFetcher } from "../../../logic/fetchers";
import { Course } from "../../../types/models/course";
import Button from "../../button/Button";
import { SolidQuill } from "../../quill/SolidQuill";
import ListComponent from "./List";

const CourseList = ListComponent<Course, { facultyId: number }>({
  fetcher: courseListFetcher,
  ItemRenderer: (props) => {
    let quill: Quill;
 
    const item = () => props.item;
    const description = () => item().description;

    return (
      <div class="flex flex-col gap-1 px-2 py-1 rounded-lg hover:bg-gray-200">
        <Link href={`/course/${item().id}`}>
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

export default CourseList;

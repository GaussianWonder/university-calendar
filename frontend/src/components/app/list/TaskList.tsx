import Quill from "quill";
import { Link } from "solid-app-router";
import { Show } from "solid-js";
import { taskListFetcher } from "../../../logic/fetchers";
import { Task } from "../../../types/models/task";
import Button from "../../button/Button";
import { SolidQuill } from "../../quill/SolidQuill";
import LeftRightStrip from "../../strip/LeftRightStrip";
import ListComponent from "./List";

const TaskList = ListComponent<Task, { courseId: number }>({
  fetcher: taskListFetcher,
  ItemRenderer: (props) => {
    const now = new Date();
    
    let quill: Quill;
    
    const item = () => props.item;
    const description = () => item().description;
    const dueDate = () => new Date(props.item.dueDate);
    
    const isDue = () => dueDate() < now;

    return (
      <div class="flex flex-col gap-1 px-2 py-1 rounded-lg hover:bg-gray-200">
        <Link href={`/task/${item().id}`}>
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
        <LeftRightStrip
          left={
            <Show when={isDue()}>
              <span flex gap-1 items-center>
                <div i-bx-task-x text-red-500 w-5 h-5 />
                <span text-red-500>Due</span>
              </span>
            </Show>
          }
          right={
            <p text-sm class={isDue() ? 'text-red-500' : 'text-green-400'}>{dueDate().toDateString()} {dueDate().toLocaleTimeString()}</p>
          }
        />
      </div>
    );
  },
});

export default TaskList;

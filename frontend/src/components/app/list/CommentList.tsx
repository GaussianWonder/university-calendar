import Quill from "quill";
import { rcommentListFetcher } from "../../../logic/fetchers";
import { Rcomment } from "../../../types/models/rcomment";
import { SolidQuill } from "../../quill/SolidQuill";
import LeftRightStrip from "../../strip/LeftRightStrip";
import ListComponent from "./List";

const CommentList = ListComponent<Rcomment, { taskId: number }>({
  fetcher: rcommentListFetcher,
  ItemRenderer: (props) => {
    let quill: Quill;
 
    const item = () => props.item;
    const description = () => item().content;
    const createdAt = () => new Date(props.item.createdAt);

    return (
      <div class="flex flex-col gap-1 px-2 py-1 rounded-lg hover:bg-gray-200">
        <h3 class="text-lg font-medium text-gray-900">{ item()?.user.username }</h3>
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
          right={
            <p text-sm text-gray-400>{createdAt().toDateString()} {createdAt().toLocaleTimeString()}</p>
          }
        />
      </div>
    );
  },
});

export default CommentList;

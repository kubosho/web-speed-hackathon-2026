import { CommentItem } from "@web-speed-hackathon-2026/client/src/components/post/CommentItem";
import { PostItem } from "@web-speed-hackathon-2026/client/src/components/post/PostItem";

interface Props {
  comments: Models.Comment[];
  post: Models.Post;
}

export const PostPage = ({ comments, post }: Props) => {
  return (
    <>
      <PostItem post={post} />
      <div>
        {comments.map((comment) => {
          return <CommentItem key={comment.id} comment={comment} />;
        })}
      </div>
    </>
  );
};

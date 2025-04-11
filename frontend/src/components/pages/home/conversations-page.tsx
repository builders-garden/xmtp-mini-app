import { Conversation, Dm, Group } from "@xmtp/browser-sdk";
import ky from "ky";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { useXMTP } from "@/context/xmtp-context";
import { useConversations } from "@/hooks/use-conversations";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

interface ConversationsPageProps {
  onSelectConversation: (conv: Conversation) => void;
}

export default function ConversationsPage({
  onSelectConversation,
}: ConversationsPageProps) {
  const { client, conversations, setConversations } = useXMTP();
  const [joining, setJoining] = useState(false);
  const { loading, list } = useConversations();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGroupJoined, setIsGroupJoined] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddMeToDefaultConversation = async () => {
    if (!client) return;

    try {
      setJoining(true);
      // call nextjs backend to set header without exposing the API_SECRET_KEY
      const data = await ky
        .post<{ success: boolean; message: string }>(`/api/proxy/add-inbox`, {
          json: {
            inboxId: client.inboxId,
          },
        })
        .json();
      setJoining(false);

      if (data.success) {
        const newConversations = await list(undefined, true);
        setConversations(newConversations);
      } else {
        console.warn("Failed to add me to the default conversation", data);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error adding me to the default conversation", error);
      setErrorMessage("Failed to add me to the default conversation");
      setJoining(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const newConversations = await list(undefined, true);
      setConversations(newConversations);
    } catch (error) {
      console.error("Error refreshing conversations", error);
      setErrorMessage("Failed to refresh conversations");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-center mt-4">
      <button
        onClick={handleAddMeToDefaultConversation}
        className={cn(
          "px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200",
          {
            "opacity-50":
              isRefreshing ||
              loading ||
              joining ||
              isGroupJoined ||
              !client ||
              !client.inboxId,
          }
        )}
        disabled={
          isRefreshing ||
          loading ||
          joining ||
          isGroupJoined ||
          !client ||
          !client.inboxId
        }
      >
        {loading || joining
          ? "Joining..."
          : isGroupJoined
          ? "Joined 'XMTP & Frames v2'"
          : "Join Chat"}
      </button>
      {errorMessage ? (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      ) : null}

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">My Conversations</h2>
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-xs text-gray-400">
            Inbox ID: {client?.inboxId?.slice(0, 6)}...
            {client?.inboxId?.slice(-4)}
          </p>
          <Button
            variant="link"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs text-gray-400 w-[100px]"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {conversations && conversations.length > 0 ? (
          conversations.map(async (conv) => {
            let convName = "";
            if (conv.metadata?.conversationType === "dm") {
              const peerInboxId = await (conv as Dm).peerInboxId();
              convName = `DM ${peerInboxId.slice(0, 6)}...${peerInboxId.slice(
                -4
              )}`;
            } else {
              convName = (conv as Group).name ?? "";
            }
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                {convName}
              </button>
            );
          })
        ) : (
          <div className="text-gray-400">No conversations found</div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Send, ShieldCheck } from 'lucide-react';
import { describeError } from '../../core/api/ApiError';
import { useAuth } from '../auth/useAuth';
import { getActiveRequestId } from './activeRequest';
import { fetchChatMessages, markChatRead, sendChatMessage, type ChatMessage } from './chatApi';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import '../../styles/chat.css';

const POLL_MS = 5000;

export default function ChatPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const tech = SAMPLE_TECHNICIAN;
  const requestId = getActiveRequestId();
  const userId = session?.user.id ?? null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState('');
  const markedCount = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requestId === null || userId === null) return;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const list = await fetchChatMessages(requestId, userId, controller.signal);
        if (controller.signal.aborted) return;
        setMessages(list);
        setLoaded(true);
        setLoadError(null);

        const received = list.filter((message) => !message.mine).length;
        if (received > markedCount.current) {
          markedCount.current = received;
          void markChatRead(requestId).catch(() => undefined);
        }
      } catch (caught) {
        if (controller.signal.aborted) return;
        setLoaded(true);
        setLoadError(describeError(caught));
      }
      if (!controller.signal.aborted) timer = setTimeout(() => void load(), POLL_MS);
    };

    void load();
    return () => {
      controller.abort();
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [requestId, userId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text === '' || sending || requestId === null || userId === null) return;

    setSending(true);
    setSendError(null);
    try {
      await sendChatMessage(requestId, text);
      setDraft('');
      setMessages(await fetchChatMessages(requestId, userId, new AbortController().signal));
    } catch (caught) {
      setSendError(describeError(caught));
    } finally {
      setSending(false);
    }
  }

  const canChat = requestId !== null && userId !== null;

  return (
    <div className="cm">
      <header className="cm-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="cm-avatar" aria-hidden="true">{initials(tech.name)}</div>
        <div className="cm-who">
          <p className="cm-name">{tech.name}</p>
          <p className="cm-role">{tech.role}</p>
        </div>
        <span className="cm-shield" aria-label="Tecnico verificado">
          <ShieldCheck size={18} />
        </span>
      </header>

      <div className="cm-messages" role="log" aria-live="polite">
        {!canChat && <p className="cm-empty">No hay una solicitud activa.</p>}
        {canChat && !loaded && <p className="cm-empty">Cargando mensajes...</p>}
        {loadError !== null && (
          <div className="alert alert--error" role="alert">
            <p>{loadError}</p>
          </div>
        )}
        {canChat && loaded && loadError === null && messages.length === 0 && (
          <p className="cm-empty">Aun no hay mensajes. Escribe para iniciar la conversacion.</p>
        )}

        {messages.map((message) => (
          <p
            key={message.id}
            className={message.mine ? 'cm-bubble cm-bubble--me' : 'cm-bubble cm-bubble--tech'}
          >
            {message.text}
          </p>
        ))}
        <div ref={bottom} />
      </div>

      {sendError !== null && (
        <div className="cm-send-error" role="alert">
          {sendError}
        </div>
      )}

      <form className="cm-composer" onSubmit={(event) => void send(event)}>
        <button type="button" className="cm-plus" aria-label="Adjuntar" disabled>
          <Plus size={22} />
        </button>
        <input
          className="cm-input"
          placeholder="Escribe un mensaje..."
          aria-label="Escribe un mensaje"
          maxLength={500}
          disabled={!canChat}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="cm-send"
          aria-label="Enviar"
          disabled={!canChat || sending || draft.trim() === ''}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
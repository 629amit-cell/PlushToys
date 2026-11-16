import {
  assertSameOrigin,
  errorResponse,
  json,
  methodNotAllowed,
  readJson,
} from "../_lib/http.js";
import { sendClientMetaEvent } from "../_lib/meta-capi.js";

export async function onRequestPost({ request, env }) {
  try {
    assertSameOrigin(request);

    const body = await readJson(request);
    const result = await sendClientMetaEvent(env, request, body);

    return json({
      accepted: Boolean(result.sent),
      configured: result.configured !== false,
      ...(result.received ? { received: result.received } : {}),
    }, result.sent ? 202 : 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export function onRequest() {
  return methodNotAllowed("POST");
}

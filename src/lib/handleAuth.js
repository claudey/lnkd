import supabase from '$lib/db'
import { toExpressRequest, toExpressResponse, toSvelteKitResponse } from '$lib/expressify'
import { combinedUserMapper } from '$lib/mappers/users'
import { getProfileById } from '$lib/queries/users/getProfile'

export async function handleAuth({ request, resolve }) {
  // Converts request to have `req.headers.cookie` on `req.cookies, as `getUserByCookie` expects parsed cookies on `req.cookies`
  const expressStyleRequest = toExpressRequest(request)
  const { user } = await supabase.auth.api.getUserByCookie(expressStyleRequest)
  const profile = await getProfileById(user?.id)
  request.locals.token = expressStyleRequest.cookies['sb:token'] || undefined
  request.locals.user = combinedUserMapper({ ...user, ...profile })

  // if we have a token, set the client to use it so we can make authorized requests to Supabase
  if (request.locals.token) {
    supabase.auth.setAuth(request.locals.token)
  }

  // TODO https://github.com/sveltejs/kit/issues/1046
  if (request.query.has('_method')) {
    request.method = request.query.get('_method').toUpperCase()
  }

  let response = await resolve(request)

  // if auth request - set cookie in response headers
  if (request.method == 'POST' && request.path === '/api/auth.json') {
    supabase.auth.api.setAuthCookie(request, toExpressResponse(response))
    response = toSvelteKitResponse(response)
  }

  return response
}

import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useKeycloak } from '~/composables/useKeycloak'

mockNuxtImport('useI18n', () => {
  return () => (
    {
      locale: 'en-CA',
      locales: ref([
        {
          name: 'English',
          code: 'en-CA',
          iso: 'en-CA',
          dir: 'ltr',
          file: 'en-CA.ts'
        }
      ]),
      t: (key: string) => key
    }
  )
})

describe('useKeycloak', () => {
  // vi.mock('keycloak-js', () => {
  //   return vi.fn().mockImplementation(() => {
  //     return {
  //       init: vi.fn(),
  //       login: vi.fn(),
  //       logout: vi.fn(),
  //       authenticated: true
  //     }
  //   })
  // })

  it('handles login', () => {
    // const mockUserProfile = { /* mock user profile data */ }
    // const keycloakMock = {
    //   init: vi.fn(),
    //   login: vi.fn(),
    //   logout: vi.fn(),
    //   authenticated: true,
    //   loadUserProfile: vi.fn().mockResolvedValue(mockUserProfile)
    // }
    // get imports
    const { $keycloak } = useNuxtApp()
    const { locale } = useI18n()

    // call function
    const keycloak = useKeycloak()
    keycloak.login()

    // assert
    expect($keycloak.login).toHaveBeenCalledOnce()
    expect($keycloak.login).toHaveBeenCalledWith({
      idpHint: 'bcsc',
      redirectUri: `${location.origin}/${locale.value}/accounts/choose-existing`
    })
  })

  it('handles logout', () => {
    // mock sessionStorage.clear()
    const sessionStorageClearMock = vi.spyOn(window.sessionStorage, 'clear')
    // get imports
    const { $keycloak } = useNuxtApp()
    const { locale } = useI18n()

    // call function
    const keycloak = useKeycloak()
    keycloak.logout()

    // assert
    expect($keycloak.logout).toHaveBeenCalledOnce()
    expect($keycloak.logout).toHaveBeenCalledWith({
      redirectUri: `${location.origin}/${locale.value}`
    })
    // logout should also clear session storage
    expect(sessionStorageClearMock).toHaveBeenCalledOnce()
  })

  it('returns the authenticated value', () => {
    // get imports
    const keycloak = useKeycloak()

    // assert
    expect(keycloak.isAuthenticated()).toEqual(true)
  })

  it('returns a kcUser object', () => {
    // get imports
    const keycloak = useKeycloak()

    // assert
    expect(keycloak.kcUser).toBeDefined()
    expect(keycloak.kcUser.value).toEqual({
      firstName: 'First',
      lastName: 'Last',
      fullName: 'First Last',
      keycloakGuid: '123456',
      userName: 'Username',
      email: 'test@email.com',
      loginSource: 'BCSC',
      roles: ['role1', 'role2']
    })
  })
})
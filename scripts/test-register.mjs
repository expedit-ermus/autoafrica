import { AuthService } from '../src/modules/auth/auth.service'
import 'dotenv/config'

const svc = new AuthService()
try {
  const res = await svc.register({ email: 'test-persistance@example.com', password: 'password123', firstName: 'Test', lastName: 'Persistance', country: 'CI', city: 'Abidjan' })
  console.log('OK', res.user.email)
} catch (e) {
  console.error('FAIL:', e)
}
process.exit(0)

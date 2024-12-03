import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

export default function Home() {
  const [user, setUser] = useState({ loggedIn: false })
  const [tweetUrl, setTweetUrl] = useState('')

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  const submitEntry = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import SocialContest from 0x9d2ade18cb6bea1a
          
          transaction(contestId: UInt64, tweetUrl: String) {
            prepare(signer: AuthAccount) {
              SocialContest.submitEntry(contestId: contestId, tweetUrl: tweetUrl)
            }
          }
        `,
        args: (arg, t) => [
          arg(1, t.UInt64),
          arg(tweetUrl, t.String)
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999
      })
      
      console.log('Transaction ID:', transactionId)
    } catch (error) {
      console.error('Error submitting entry:', error)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Social Media Contest</h1>
      
      {user.loggedIn ? (
        <div>
          <p>Connected: {user?.addr}</p>
          <button onClick={() => fcl.unauthenticate()}>Log Out</button>
          
          <div className='mt-4'>
            <input 
              type='text'
              placeholder='Enter your tweet URL'
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              className='border p-2 mr-2'
            />
            <button 
              onClick={submitEntry}
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Submit Entry
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => fcl.authenticate()}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
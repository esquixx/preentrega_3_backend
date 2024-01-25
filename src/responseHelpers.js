// responseHelpers.js
export const sendSuccess = (res, payload) => res.json({ status: 'success', payload })

export const createdSuccess = (res, payload) => res.status(201).json({ status: 'success', payload })

export const sendServerError = (res, error) => res.status(500).json({ status: 'error', error })

export const sendUserError = (res, error) => res.status(400).json({ status: 'error', error })

export const authFailError = (res, error) => res.status(401).json({ status: 'error', error })

export const sendRequestError = (res, error) => res.status(404).json({ status: 'error', error })

import { catchErrors } from 'errors';
import { User } from 'entities';
import { updateEntity } from 'utils/typeorm';

export const getCurrentUser = catchErrors((req, res) => {
  res.respond({ currentUser: req.currentUser });
});
export const updateCurrentUser = catchErrors(async (req, res) => {
  const user = await updateEntity(User, req.currentUser.id, req.body);
  res.respond({ currentUser: user });
});

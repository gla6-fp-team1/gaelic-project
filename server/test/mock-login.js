import passport from "passport";

class StrategyMock extends passport.Strategy {
	constructor() {
		super();
		this.name = "mock";
		this.verify = (user, done) => {
			done(null, user);
		};
	}

	authenticate(req) {
		let user = null;
		if (req.query.user_id) {
			user = {
				id: req.query.user_id,
			};
		}

		this.verify(user, (err, resident) => {
			if (err) {
				this.fail(err);
			} else {
				this.success(resident);
			}
		});
	}
}

export default function (app, userId) {
	passport.use(
		new StrategyMock({
			userId: userId,
		})
	);

	app.get("/api/mock/login", passport.authenticate("mock"));
}

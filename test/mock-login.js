import passport from "passport";

class StrategyMock extends passport.Strategy {
	constructor(options) {
		super();
		this.name = "mock";
		this.userId = options.userId;
		this.verify = (user, done) => {
			done(null, user);
		};
	}

	authenticate() {
		let user = {
			id:
				(typeof this.userId === "function" ? this.userId() : this.userId) || 1,
		};

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

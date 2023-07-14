import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-screen-xl gap-8 p-8 md:flex">
        <div className="md:basis-1/2">
          <Image
            className="rounded-lg"
            src="/images/home.jpg"
            width={800}
            height={600}
            alt={""}
          />
        </div>

        <div className="mt-4 md:mt-0 md:basis-1/2">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome to Stocks: Simplifying Your Investment Journey
            </h1>
            <p className="mt-4">
              Making sense of the stock market can feel like deciphering a
              foreign language. But with Stocks, we turn this complexity into
              simplicity. Our dynamic platform empowers you to manage your
              investment portfolio with ease and efficiency, giving you more
              time to focus on what truly matters.
            </p>
            <p className="mt-2">
              Whether you're an amateur trader or a seasoned investor, Stocks
              equips you with the essential tools to stay on top of your game.
            </p>
          </div>

          <h3 className="mt-4 text-xl font-semibold">
            Join Stocks today and experience the difference:
          </h3>
          <ul className="mt-4">
            <li>
              <span className="font-semibold">
                Effortless Portfolio Management:
              </span>{" "}
              Add or adjust positions, and track their live prices. Stay on top
              of your investments like never before.
            </li>
            <li className="mt-2">
              <span className="font-semibold">Live Market Updates:</span> Stay
              informed with real-time updates from the markets. Make the most of
              every investment opportunity.
            </li>
            <li className="mt-2">
              <span className="font-semibold">
                Comprehensive Transaction Tracking:
              </span>{" "}
              Log buy & sell transactions effortlessly. We keep a detailed
              history for easy analysis and tax preparation.
            </li>
            <li className="mt-2">
              <span className="font-semibold">
                Real-Time Profit & Loss Analysis:
              </span>{" "}
              Monitor your gains and losses in real time. Stay ahead with our
              robust analysis tools.
            </li>
            <li className="mt-2">
              <span className="font-semibold">
                Personalized User Interface:
              </span>{" "}
              Create a custom view of your portfolio. Tailor your Stocks
              experience to your unique needs.
            </li>
            <li className="mt-2">
              <span className="font-semibold">Unmatched Security:</span> Your
              security is our priority. We protect your data with advanced
              encryption and security measures.
            </li>
          </ul>

          <p className="mt-4">
            Embrace the future of investment tracking with Stocks. Let's
            redefine your investment journey together.
          </p>
        </div>
      </div>
    </main>
  );
}

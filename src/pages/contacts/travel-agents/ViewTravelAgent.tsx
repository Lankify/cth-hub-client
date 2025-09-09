import type { ITravelAgent } from "../../../types";
import { FaImage, FaFacebook, FaInstagram } from "react-icons/fa";

interface Props {
  data: ITravelAgent;
}

const labelStyle = "font-semibold text-sm text-primary-txt";
const valueStyle = "text-base text-secondary-txt";
const mainContainerStyle = "grid grid-cols-1 gap-4 rounded-sm px-6 py-4 md:grid-cols-2 bg-secondary";
const subContainerStyle = "rounded-sm px-6 py-4 bg-secondary";

const formatDate = (date?: string) => {
  return date ? new Date(date).toLocaleDateString("en-GB") : "-";
};

const ViewTravelAgents: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-center">
        {data.logoUrl ? (
          <img src={data.logoUrl} alt="logo" className="h-40 w-40 rounded-md object-contain" />
        ) : (
          <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md object-contain text-sm text-gray-400 dark:bg-gray-800">
            <FaImage className="mb-1 text-6xl" />
            No logo selected
          </div>
        )}
      </div>
      {/* Name & Description */}
      <div className="mb-8 text-center">
        <h2 className="text-primary-txt text-2xl font-bold">{data.name || "-"}</h2>
        <p className="text-secondary-txt font-semi-bold mt-2 text-sm">{data.description || "No Description"}</p>
      </div>

      {/* Registration / Country / Address */}
      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Registration No.</div>
            <div className={valueStyle}>{data.registrationNumber || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Country</div>
            <div className={valueStyle}>{data.country || "-"}</div>
          </div>
          <div className="md:col-span-2">
            <div className={labelStyle}>Address</div>
            <div className={valueStyle}>
              {data.address || "-"}
              {data.city ? `, ${data.city}` : ""}
              {data.province ? `, ${data.province}` : ""}
              {data.postalCode ? `, ${data.postalCode}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={mainContainerStyle}>
        <div>
          <div className={labelStyle}>Email</div>
          {data.email ? (
            <a href={`mailto:${data.email}`} className="text-primary-blue hover:opacity-80">
              {data.email}
            </a>
          ) : (
            <div className={valueStyle}>-</div>
          )}
        </div>
        <div>
          <div className={labelStyle}>Phone</div>
          {data.phone ? (
            <a href={`tel:${data.phone}`} className="text-primary-blue hover:opacity-80">
              {data.phone}
            </a>
          ) : (
            <div className={valueStyle}>-</div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className={labelStyle}>Alternate Phone</div>
          {data.alternatePhone ? (
            <a href={`tel:${data.alternatePhone}`} className="text-primary-blue hover:opacity-80">
              {data.alternatePhone}
            </a>
          ) : (
            <div className={valueStyle}>-</div>
          )}
        </div>
      </div>

      {/* Extra Info */}
      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Contact Person */}
          <div>
            <div className={labelStyle}>Contact Person</div>
            <div className={valueStyle}>{data.ownerName || "-"}</div>
          </div>

          {/* Designation */}
          <div>
            <div className={labelStyle}>Designation</div>
            <div className={valueStyle}>{data.designation || "-"}</div>
          </div>

          {/* Website */}
          <div>
            <div className={labelStyle}>Website</div>
            {data.website ? (
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-blue hover:underline"
              >
                {data.website}
              </a>
            ) : (
              <div className={valueStyle}>-</div>
            )}
          </div>

          {/* Social */}
          <div>
            <div className={labelStyle}>Social</div>
            <div className="mt-1 flex items-center gap-4">
              {/* Facebook */}
              {data.facebook ? (
                <a
                  href={data.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-blue-600 hover:opacity-80"
                >
                  <FaFacebook />
                </a>
              ) : (
                <FaFacebook className="text-xl text-gray-400" />
              )}
              {/* Instagram */}
              {data.instagram ? (
                <a
                  href={data.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-pink-500 hover:opacity-80"
                >
                  <FaInstagram />
                </a>
              ) : (
                <FaInstagram className="text-xl text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Created / Updated */}
      <div className={`${mainContainerStyle} bg-tertiary`}>
        <div>
          <div className={labelStyle}>Created :</div>
          <div className={valueStyle}>{formatDate(data.createdAt)}</div>
        </div>
        <div>
          <div className={labelStyle}>Updated :</div>
          <div className={valueStyle}>{formatDate(data.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelAgents;
